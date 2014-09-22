cd node_modules/MathJax-node

git submodule init
git submodule update

cd batik
curl http://apache.org/dist/xmlgraphics/batik/batik-1.7-jre13.zip > batik-1.7-jre13.zip
jar xvf batik-1.7-jre13.zip
mv batik-1.7/* .
cd -

cd -
